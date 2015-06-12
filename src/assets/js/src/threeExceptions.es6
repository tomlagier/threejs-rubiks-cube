class Exception {
  constructor(message) {
    this.message = message;
    this.toString = ()=> this.constructor.name + ' -- ' + this.message;
  }
}

class TypeException extends Exception {}
class IncompleteOptionsException extends Exception {}
class MissingParameterException extends Exception {}
class UnsupportedLoaderException extends Exception {}
class ExecutionException extends Exception {}
class NotFoundException extends Exception {}

module.exports = {
  Exception,
  TypeException,
  IncompleteOptionsException,
  MissingParameterException,
  UnsupportedLoaderException,
  ExecutionException,
  NotFoundException
};
