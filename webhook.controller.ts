import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {Prisma, Webhook} from '@prisma/client';
import {CursorPipe} from '@framework/pipes/cursor.pipe';
import {OptionalIntPipe} from '@framework/pipes/optional-int.pipe';
import {OrderByPipe} from '@framework/pipes/order-by.pipe';
import {WherePipe} from '@framework/pipes/where.pipe';
import {
  CreateWebhookDto,
  ReplaceWebhookDto,
  UpdateWebhookDto,
} from './webhook.dto';
import {WebhookService} from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  /** Create a webhook for a group */
  @Post()
  async create(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() data: CreateWebhookDto
  ): Promise<Webhook> {
    return this.webhookService.createWebhook(groupId, data);
  }

  /** Get webhooks for a group */
  @Get()
  async getAll(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('skip', OptionalIntPipe) skip?: number,
    @Query('take', OptionalIntPipe) take?: number,
    @Query('cursor', CursorPipe) cursor?: Prisma.WebhookWhereUniqueInput,
    @Query('where', WherePipe) where?: Record<string, number | string>,
    @Query('orderBy', OrderByPipe) orderBy?: Record<string, 'asc' | 'desc'>
  ): Promise<Webhook[]> {
    return this.webhookService.getWebhooks(groupId, {
      skip,
      take,
      orderBy,
      cursor,
      where,
    });
  }

  /** Get webhook scopes for a group */
  @Get('scopes')
  async scopes(): Promise<Record<string, string>> {
    return this.webhookService.getWebhookScopes();
  }

  /** Get a webhook for a group */
  @Get(':id')
  async get(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Webhook> {
    return this.webhookService.getWebhook(groupId, id);
  }

  /** Update a webhook for a group */
  @Patch(':id')
  async update(
    @Body() data: UpdateWebhookDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Webhook> {
    return this.webhookService.updateWebhook(groupId, id, data);
  }

  /** Replace a webhook for a group */
  @Put(':id')
  async replace(
    @Body() data: ReplaceWebhookDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Webhook> {
    return this.webhookService.updateWebhook(groupId, id, data);
  }

  /** Delete a webhook for a group */
  @Delete(':id')
  async remove(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Webhook> {
    return this.webhookService.deleteWebhook(groupId, id);
  }
}
