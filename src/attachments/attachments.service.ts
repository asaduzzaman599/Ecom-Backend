import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { RequestWithUser } from 'libs/common/types/request-with-user';
import { MasterService } from 'libs/master/master.service';
import { nanoid } from 'nanoid';
import * as path from 'path';

@Injectable()
export class AttachmentsService {
  constructor(private readonly customPrisma: MasterService) {}
  async upload(
    files: Express.Multer.File[],
    option?: { tx?: Prisma.TransactionClient },
    context?: RequestWithUser,
  ) {
    const attachmentId = nanoid();
    const uploaded = await Promise.all(
      files.map((file) => this.saveOnLocal({ file })),
    );

    return Promise.all(
      files.map((file, idx) => {
        const { fileId } = uploaded[idx];
        const extension = file.originalname.split('.').at(-1);

        return (option?.tx ?? this.customPrisma).attachment.create({
          data: {
            attachmentId,
            fileId,
            extension,
            mimetype: file.mimetype,
            ...(context.user ? { createdBy: context.user.id } : null),
          },
        });
      }),
    );
  }

  async getFile(args: Prisma.AttachmentWhereInput) {
    if (!args) throw new BadRequestException('get file Invalid arguments!');
    const attachment = await this.customPrisma.attachment.findFirst({
      where: args,
    });
    if (!attachment) {
      throw new BadRequestException('No attachment found!');
    }

    const buffer = await this.getFromLocal({
      fileId: attachment.fileId,
    });

    return {
      buffer,
      mimetype: attachment.mimetype,
    };
  }

  async getAttachmentUrls(args: Prisma.AttachmentWhereUniqueInput) {
    const attachments = await this.customPrisma.attachment.findUnique({
      where: args,
    });
    if (!attachments) {
      throw new BadRequestException('No attachment found!');
    }
    return attachments;
  }

  private async saveOnLocal(input: {
    file: Express.Multer.File;
  }): Promise<Record<string, string>> {
    const fileId = nanoid();
    const uploadDir = path.join(__dirname, 'attachments');
    const uploadPath = path.join(uploadDir, `${fileId}`);

    // Check if uploads directory exists, create if not
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file to disk
    return new Promise((resolved) => {
      fs.writeFile(uploadPath, input.file.buffer, (err) => {
        if (err) {
          throw new BadRequestException('Failed to save file');
        }
        resolved({
          msg: 'File uploaded!',
          file: uploadDir,
          fileId,
        });
      });
    });
  }

  private async getFromLocal(args: { fileId: string }) {
    const fileName = `${args.fileId}`;
    const filePath = path.join(__dirname, 'attachments', fileName);
    const buffer = await new Promise((resolved) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          throw new BadRequestException('Failed to get file');
        } else {
          resolved(data);
        }
      });
    });
    return buffer;
  }
}
