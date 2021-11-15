import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // READ (find)
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      if (params.model == 'Task') {
        if (!params.args) {
          params.args = { where: {} };
        }
        if (params.action == 'findUnique') {
          // Change to findFirst - you cannot filter
          // by anything except ID / unique with findUnique
          params.action = 'findFirst';
          // Add 'deletedAt' filter
          // ID filter maintained
          params.args.where['deletedAt'] = null;
        }
        if (params.action == 'findMany') {
          // Find many queries
          if (params.args.where != undefined) {
            if (params.args.where.deletedAt == undefined) {
              // Exclude deletedAt records if they have not been expicitly requested
              params.args.where['deletedAt'] = null;
            }
          } else {
            params.args['where'] = { deletedAt: null };
          }
        }
      }
      return next(params);
    });

    // UPDATE
    this.$use(async (params, next) => {
      if (params.model == 'Task') {
        if (!params.args) {
          params.args = { where: {} };
        }
        /**
         * See:
         * https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware#option-2-use-middleware-to-determine-the-behavior-of-readupdate-queries-for-deleted-records
         * Update return { count: n } instead of Task
         */
        if (params.action == 'update') {
          // Change to updateMany - you cannot filter
          // by anything except ID / unique with findUnique
          params.action = 'updateMany';
          // Add 'deletedAt' filter
          // ID filter maintained
          params.args.where['deletedAt'] = null;
        }
        if (params.action == 'updateMany') {
          if (params.args.where != undefined) {
            params.args.where['deletedAt'] = null;
          } else {
            params.args['where'] = { deletedAt: null };
          }
        }
      }
      return next(params);
    });

    // DELETE
    this.$use(async (params, next) => {
      // Check incoming query type
      if (params.model === 'Task') {
        if (!params.args) {
          params.args = { where: {} };
        }
        if (params.action == 'delete') {
          // Delete queries
          // Change action to an update
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
        }
        if (params.action == 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deletedAt'] = new Date();
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
        }
      }
      return next(params);
    });

    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
