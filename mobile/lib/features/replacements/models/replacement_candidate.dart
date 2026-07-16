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
    this.identifierNumber,
    this.distanceKm,
    this.comment,
    this.respondedAt,
    this.bio,
    this.skills = const [],
    this.availability,
    this.memberSince,
    this.completedReplacementsCount,
    this.isVerified = false,
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
  final String? identifierNumber;
  final double? distanceKm;
  final String? comment;
  final DateTime? respondedAt;
  final String? bio;
  final List<String> skills;
  final String? availability;
  final DateTime? memberSince;
  final int? completedReplacementsCount;
  final bool isVerified;

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

  ReplacementCandidate copyWith({
    String? status,
    String? statusLabel,
  }) {
    return ReplacementCandidate(
      responseId: responseId,
      status: status ?? this.status,
      statusLabel: statusLabel ?? this.statusLabel,
      respondentName: respondentName,
      canViewContact: canViewContact,
      respondentAvatarUrl: respondentAvatarUrl,
      respondentCity: respondentCity,
      respondentZipCode: respondentZipCode,
      respondentPhone: respondentPhone,
      respondentEmail: respondentEmail,
      identifierNumber: identifierNumber,
      distanceKm: distanceKm,
      comment: comment,
      respondedAt: respondedAt,
      bio: bio,
      skills: skills,
      availability: availability,
      memberSince: memberSince,
      completedReplacementsCount: completedReplacementsCount,
      isVerified: isVerified,
    );
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

const replacementCandidateAvailabilityLabels = <String, String>{
  'available': 'Disponible',
  'busy': 'Occupé(e)',
  'invisible': 'Masqué(e)',
};

String? replacementCandidateAvailabilityLabel(String? availability) {
  if (availability == null) {
    return null;
  }
  return replacementCandidateAvailabilityLabels[availability];
}
