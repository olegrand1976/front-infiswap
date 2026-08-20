// A candidate's reply to one of my own pairing requests. Unlike PairingItem,
// full identity is shown here — this is data about someone who answered me.
enum PairingResponseBucket { pending, accepted, closed }

const pairingResponseStatusLabels = <String, String>{
  'pending': 'En attente',
  'accepted': 'Acceptée',
  'rejected': 'Refusée',
  'canceled': 'Annulée',
};

String pairingResponseStatusLabel(String status) =>
    pairingResponseStatusLabels[status] ?? status;

PairingResponseBucket pairingResponseBucket(String status) {
  switch (status) {
    case 'accepted':
      return PairingResponseBucket.accepted;
    case 'rejected':
    case 'canceled':
      return PairingResponseBucket.closed;
    default:
      return PairingResponseBucket.pending;
  }
}

class PairingResponse {
  const PairingResponse({
    required this.id,
    required this.pairingId,
    required this.pairingDescription,
    required this.respondentName,
    required this.respondentCity,
    required this.status,
    required this.comment,
    required this.respondedAt,
  });

  final int id;
  final int pairingId;
  final String? pairingDescription;
  final String respondentName;
  final String? respondentCity;
  final String status;
  final String? comment;
  final DateTime? respondedAt;

  String get initials {
    final parts = respondentName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty || parts.first.isEmpty) {
      return '?';
    }
    final first = parts.first[0];
    final last = parts.length > 1 && parts.last.isNotEmpty ? parts.last[0] : '';
    return (first + last).toUpperCase();
  }

  PairingResponse copyWith({String? status}) {
    return PairingResponse(
      id: id,
      pairingId: pairingId,
      pairingDescription: pairingDescription,
      respondentName: respondentName,
      respondentCity: respondentCity,
      status: status ?? this.status,
      comment: comment,
      respondedAt: respondedAt,
    );
  }

  factory PairingResponse.fromJson(Map<String, dynamic> json) {
    // Laravel snake_cases relation names on the way out: userPartner() and
    // interestedUser() become user_partner / interested_user in the JSON.
    final pairing = json['user_partner'] as Map? ?? const {};
    final respondent = json['interested_user'] as Map? ?? const {};
    final profile = respondent['profile'] as Map? ?? const {};
    final name = (respondent['full_name'] as String?)?.trim();

    return PairingResponse(
      id: json['id'] as int? ?? 0,
      pairingId: json['user_partner_id'] as int? ?? pairing['id'] as int? ?? 0,
      pairingDescription: (pairing['description'] as String?)?.trim(),
      respondentName: (name != null && name.isNotEmpty) ? name : 'Infirmière',
      respondentCity: (respondent['city'] ?? profile['city'])?.toString(),
      status: json['status'] as String? ?? 'pending',
      comment: (json['description'] as String?)?.trim(),
      respondedAt: DateTime.tryParse(json['created_at']?.toString() ?? ''),
    );
  }
}
