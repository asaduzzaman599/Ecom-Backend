import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'libs/decorator/public_access.decorator';
import { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { ALL } from 'libs/decorator/all_access.decorator';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-file')
  @ALL()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() context?: RequestWithUser,
  ) {
    return this.attachmentsService.upload([file], {}, context);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @Post('multi-upload-file')
  @ALL()
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() context?: RequestWithUser,
  ) {
    return this.attachmentsService.upload(files, {}, context);
  }

  @Get(':attachmentId')
  @ALL()
  async attachments(
    @Res() res: Response,
    @Param('attachmentId') attachmentId: string,
  ) {
    //? will return all files with attachmentId
    const attachment = await this.attachmentsService.getFile({
      attachmentId,
    });
    res.set({
      'Content-Type': attachment.mimetype,
    });
    res.end(attachment.buffer);
  }

  @Get('file/:fileId')
  @ALL()
  async file(@Res() res: Response, @Param('fileId') fileId: string) {
    //? will return file with fileId
    const attachment = await this.attachmentsService.getFile({
      fileId,
    });
    res.set({
      'Content-Type': attachment.mimetype,
    });
    res.end(attachment.buffer);
  }

  @Get('file/:fileId/url')
  @Public()
  async fileUrl(@Res() res: Response, @Param('fileId') fileId: string) {
    //? need to update this to fetch url with images own ID will return string url only
    const attachment = await this.attachmentsService.getFile({
      fileId: fileId,
    });
    res.set({
      'Content-Type': attachment.mimetype,
    });
    res.end(attachment.buffer);
  }

  @Get(':attachmentId/urls')
  @Public()
  async getAttachmentUrls(@Param('attachmentId') attachmentId: string) {
    //? need to update this to fetch urls of all file with single attachmentId and will return urls array
    return this.attachmentsService.getAttachmentUrls({ id: attachmentId });
  }
}
