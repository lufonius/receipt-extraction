package ch.lucfonjallaz.drezip.core

import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.http.HttpStatus

import org.springframework.http.ResponseEntity

import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.persistence.EntityNotFoundException

// in case of an error the stack trace should not be revealed
// this exception handler provides the default mapping
// in case custom errors should be returned, the controllers methods can be wrapped within try / catch blocks
@ControllerAdvice
class RestExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler
    protected fun handleAnyError(ex: RuntimeException) = ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ServiceError(errorCode = ServiceErrorCode.GENERIC, message = "an unexpected problem occured"))

    @ExceptionHandler(value = [EntityNotFoundException::class, EmptyResultDataAccessException::class])
    protected fun handleNotFoundException(ex: RuntimeException) = ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ServiceError(errorCode = ServiceErrorCode.ENTITY_NOT_FOUND, message = "could not find entity"))
}