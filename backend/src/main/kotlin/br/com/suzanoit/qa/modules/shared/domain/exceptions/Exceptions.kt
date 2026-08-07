package br.com.suzanoit.qa.modules.shared.domain.exceptions

open class BusinessException(message: String) : RuntimeException(message)

class ResourceNotFoundException(resourceName: String, fieldName: String, fieldValue: Any) : 
    BusinessException("$resourceName not found with $fieldName : '$fieldValue'")

class UnauthorizedException(message: String) : RuntimeException(message)
