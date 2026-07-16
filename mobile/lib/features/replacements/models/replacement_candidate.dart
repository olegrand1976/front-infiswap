class ReplacementCandidate {
  const ReplacementCandidate({
    required this.responseId,
    required this.status,
    required this.statusLabel,
    required this.respondentName,
    required this.canViewContact,
    this.respondentAvatarUrl,
    this.respondentCity,
    this.respondentZipCode,
    this.respondentPhone,
    this.respondentEmail,
    this.distanceKm,
    this.comment,
    this.respondedAt,
  });

  final int responseId;
  final String status;
  final String statusLabel;
  final String respondentName;
  final bool canViewContact;
  final String? respondentAvatarUrl;
  final String? respondentCity;
  final String? respondentZipCode;
  final String? respondentPhone;
  final String? respondentEmail;
  final double? distanceKm;
  final String? comment;
  final DateTime? respondedAt;

  String get initials {
    final parts = respondentName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) {
      return '?';
    }
    final first = parts.first[0];
    final last = parts.length > 1 && parts.last.isNotEmpty
        ? parts.last[0]
        : '';
    return (first + last).toUpperCase();
  }
}

const replacementCandidateStatusLabels = <String, String>{
  'pending': 'En attente',
  'confirmed': 'Acceptée',
  'canceled': 'Annulée',
  'cancelled': 'Annulée',
  'refused': 'Refusée',
};

String replacementCandidateStatusLabel(String status) {
  return replacementCandidateStatusLabels[status] ?? status;
}

enum ReplacementCandidateBucket { pending, accepted, closed }

ReplacementCandidateBucket replacementCandidateBucket(String status) {
  switch (status) {
    case 'confirmed':
      return ReplacementCandidateBucket.accepted;
    case 'refused':
    case 'canceled':
    case 'cancelled':
      return ReplacementCandidateBucket.closed;
    default:
      return ReplacementCandidateBucket.pending;
  }
}
