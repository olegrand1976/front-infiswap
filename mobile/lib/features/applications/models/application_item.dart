import '../../replacements/models/replacement_item.dart';

class ApplicationItem {
  const ApplicationItem({
    required this.responseId,
    required this.status,
    required this.statusLabel,
    required this.appliedAt,
    required this.replacement,
    this.patientCount,
  });

  final int responseId;
  final String status;
  final String statusLabel;
  final DateTime? appliedAt;
  final ReplacementItem replacement;
  final int? patientCount;
}

const applicationStatusLabels = <String, String>{
  'pending': 'En attente',
  'confirmed': 'Confirmé',
  'chat_enabled': 'Chat activé',
  'canceled': 'Annulé',
  'cancelled': 'Annulé',
  'refused': 'Refusé',
};

String applicationStatusLabel(String status) {
  return applicationStatusLabels[status] ?? status;
}
