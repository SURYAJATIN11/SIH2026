"""Custom exceptions for the application."""


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundException(AppException):
    """Resource not found."""

    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} with identifier '{identifier}' not found",
            status_code=404,
        )


class ValidationError(AppException):
    """Data validation failed."""

    def __init__(self, message: str):
        super().__init__(message=message, status_code=422)


class ConflictError(AppException):
    """Resource conflict (duplicate, constraint violation)."""

    def __init__(self, message: str):
        super().__init__(message=message, status_code=409)


class IngestionError(AppException):
    """Data ingestion failed."""

    def __init__(self, message: str):
        super().__init__(message=message, status_code=400)


class PlanningError(AppException):
    """Planning operation failed."""

    def __init__(self, message: str):
        super().__init__(message=message, status_code=500)


class OptimizerError(AppException):
    """Optimizer service error."""

    def __init__(self, message: str):
        super().__init__(message=message, status_code=502)
