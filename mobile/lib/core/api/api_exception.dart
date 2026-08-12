import 'package:dio/dio.dart';

class ApiException implements Exception {
  ApiException({
    required this.message,
    this.statusCode,
    this.code,
    this.errors,
  });

  final String message;
  final int? statusCode;
  final String? code;

  final Map<String, List<String>>? errors;


  bool get isPlatformAccessRequired =>
      statusCode == 403 && code == 'platform_access_required';

  factory ApiException.fromDio(DioException error) {
    final response = error.response;
    final data = response?.data;

    String message = 'Une erreur réseau est survenue.';
    String? code;
    Map<String, List<String>>? errors;

    if (data is Map<String, dynamic>) {
      final rawErrors = data['errors'];
      if (rawErrors is Map) {
        errors = rawErrors.map(
          (key, value) => MapEntry(
            key.toString(),
            value is List
                ? value.map((e) => e.toString()).toList()
                : [value.toString()],
          ),
        );
      }

      final rawMessage = data['message'];
      if (rawMessage is String && rawMessage.isNotEmpty) {
        message = rawMessage;
      } else if (errors != null && errors.isNotEmpty) {
        message = errors.values.first.first;
      }
      final rawCode = data['code'];
      if (rawCode is String) {
        code = rawCode;
      }
    } else if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout) {
      message = 'Délai de connexion dépassé.';
    } else if (error.type == DioExceptionType.connectionError) {
      message = 'Erreur serveur';
    }

    return ApiException(
      message: message,
      statusCode: response?.statusCode,
      code: code,
      errors: errors,
    );
  }

  @override
  String toString() => message;
}
