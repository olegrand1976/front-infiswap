// Shape matches UserPartnerResource::defaultArray on the API — city, zip
// code and premium flag only. Identity is never exposed before a response
// is accepted, so there is no name/avatar field here on purpose.
enum PairingType { search, available }

PairingType pairingTypeFromApi(String? value) =>
    value == 'available' ? PairingType.available : PairingType.search;

String pairingTypeApiValue(PairingType type) =>
    type == PairingType.available ? 'available' : 'in_search';

const pairingTypeLabels = <PairingType, String>{
  PairingType.search: 'À la recherche d’une collaboration',
  PairingType.available: 'Disponible pour collaborer',
};

class PairingItem {
  const PairingItem({
    required this.id,
    required this.authorId,
    required this.city,
    required this.zipCode,
    required this.isPremium,
    required this.type,
    required this.description,
    required this.hasResponded,
    required this.createdAt,
  });

  final int id;
  final int authorId;
  final String city;
  final String zipCode;
  final bool isPremium;
  final PairingType type;
  final String? description;
  final bool hasResponded;
  final DateTime? createdAt;

  PairingItem copyWith({bool? hasResponded}) {
    return PairingItem(
      id: id,
      authorId: authorId,
      city: city,
      zipCode: zipCode,
      isPremium: isPremium,
      type: type,
      description: description,
      hasResponded: hasResponded ?? this.hasResponded,
      createdAt: createdAt,
    );
  }

  factory PairingItem.fromJson(Map<String, dynamic> json) {
    final user = json['user'] as Map? ?? const {};

    return PairingItem(
      id: json['id'] as int? ?? 0,
      authorId: user['id'] as int? ?? 0,
      city: (user['city'] as String?)?.trim() ?? '',
      zipCode: (user['zip_code'] as String?)?.trim() ?? '',
      isPremium: user['is_premium'] == true,
      type: pairingTypeFromApi(json['type'] as String?),
      description: (json['description'] as String?)?.trim(),
      hasResponded: json['has_responded'] == true,
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? ''),
    );
  }
}
