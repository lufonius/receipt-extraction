package ch.lucfonjallaz.drezip.core

data class ServiceError(
        val errorCode: ServiceErrorCode,
        val message: String? = null
)