import '../../../core/config/app_config.dart';
import '../../replacements/data/replacement_mapper.dart';
import '../models/application_item.dart';

abstract final class ApplicationMapper {
  static ApplicationItem fromAppliedJson(
    Map<String, dynamic> json, {
    required String storageBaseUrl,
  }) {
    final response = _asMap(json['response']) ?? {};
    final replacement = _asMap(json['replacement']) ?? {};

    final status = response['status']?.toString() ?? 'pending';
    final createdAt = response['created_at']?.toString();

    return ApplicationItem(
      responseId: _parseInt(response['id']) ?? 0,
      status: status,
      statusLabel: applicationStatusLabel(status),
      appliedAt: createdAt != null ? DateTime.tryParse(createdAt) : null,
      patientCount: _parseInt(replacement['patient_count']),
      replacement: ReplacementMapper.fromReplacementJson(replacement),
    );
  }

  static Map<String, dynamic>? _asMap(Object? value) {
    if (value is Map) {
      return value.map((key, val) => MapEntry(key.toString(), val));
    }
    return null;
  }

  static int? _parseInt(Object? value) {
    if (value is int) {
      return value;
    }
    if (value is String) {
      return int.tryParse(value);
    }
    return null;
  }
}
