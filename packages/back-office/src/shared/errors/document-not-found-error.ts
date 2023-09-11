import { HttpException, HttpStatus } from '@nestjs/common';

export class DocumentNotFoundError extends HttpException {
  name = 'DocumentNotFoundError';

  constructor(id: string, message?: string) {
    super(message || `Document not found with ID: ${id}`, HttpStatus.NOT_FOUND);
  }
}
