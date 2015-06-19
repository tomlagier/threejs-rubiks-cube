export class Exception {
  constructor(message) {
    this.message = message;
    this.toString = ()=> this.constructor.name + ' -- ' + this.message;
  }
}

export class TypeException extends Exception {}
export class IncompleteOptionsException extends Exception {}
export class MissingParameterException extends Exception {}
export class UnsupportedLoaderException extends Exception {}
export class NotFoundException extends Exception {}
export class AlreadyExistsException extends Exception {}
export class UnsupportedBrowserException extends Exception {}
export class StreamErrorException extends Exception {}
export class StreamNotReadyException extends Exception {}

export default {
  Exception,
  TypeException,
  IncompleteOptionsException,
  MissingParameterException,
  UnsupportedLoaderException,
  NotFoundException,
  AlreadyExistsException,
  UnsupportedBrowserException,
  StreamErrorException,
  StreamNotReadyException
};
