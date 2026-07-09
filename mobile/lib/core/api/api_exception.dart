import 'package:dio/dio.dart';

class ApiException implements Exception {
  ApiException({
    required this.message,
    this.statusCode,
    this.code,
  });

  final String message;
  final int? statusCode;
  final String? code;

  factory ApiException.fromDio(DioException error) {
    final response = error.response;
    final data = response?.data;

    String message = 'Une erreur réseau est survenue.';
    String? code;

    if (data is Map<String, dynamic>) {
      final rawMessage = data['message'];
      if (rawMessage is String && rawMessage.isNotEmpty) {
        message = rawMessage;
      }
      final rawCode = data['code'];
      if (rawCode is String) {
        code = rawCode;
      }
    } else if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout) {
      message = 'Délai de connexion dépassé. Vérifiez l\'URL de l\'API.';
    } else if (error.type == DioExceptionType.connectionError) {
      message =
          'Impossible de joindre l\'API. Vérifiez que le serveur Laravel tourne.';
    }

    return ApiException(
      message: message,
      statusCode: response?.statusCode,
      code: code,
    );
  }

  @override
  String toString() => message;
}
