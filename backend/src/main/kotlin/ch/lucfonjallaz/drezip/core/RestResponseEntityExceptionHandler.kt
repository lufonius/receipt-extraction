package ch.lucfonjallaz.drezip.core

import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus

import org.springframework.http.ResponseEntity

import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.persistence.EntityNotFoundException

// this controller exists for the reason to not expose the stack trace in case of an error
// as spring would do it per default
@ControllerAdvice
class RestResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler
    protected fun handleAnyError(ex: RuntimeException) = ResponseEntity<Any>(HttpStatus.INTERNAL_SERVER_ERROR)

    @ExceptionHandler(value = [EntityNotFoundException::class, EmptyResultDataAccessException::class])
    protected fun handleNotFoundException(ex: RuntimeException) = ResponseEntity<Any>(HttpStatus.NOT_FOUND)
}