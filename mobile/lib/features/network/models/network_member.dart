class NetworkMember {
  const NetworkMember({
    required this.id,
    required this.firstname,
    required this.lastname,
    required this.email,
    required this.phone,
    required this.zipCode,
    required this.city,
  });

  final int id;
  final String firstname;
  final String lastname;
  final String email;
  final String phone;
  final String zipCode;
  final String city;

  String get fullName => '$firstname $lastname'.trim();

  String get initials {
    final first = firstname.isNotEmpty ? firstname[0] : '';
    final last = lastname.isNotEmpty ? lastname[0] : '';
    return '$first$last'.toUpperCase();
  }

  String get location =>
      [zipCode, city].where((part) => part.isNotEmpty).join(' · ');

  factory NetworkMember.fromJson(Map<String, dynamic> json) {
    final profile = json['profile'] as Map? ?? const {};

    return NetworkMember(
      id: int.tryParse(json['id']?.toString() ?? '') ?? 0,
      firstname: (json['firstname'] as String?)?.trim() ?? '',
      lastname: (json['lastname'] as String?)?.trim() ?? '',
      email: (json['email'] as String?)?.trim() ?? '',
      phone: (json['phone_number'] as String?)?.trim() ?? '',
      zipCode: profile['zip_code']?.toString().trim() ?? '',
      city: (profile['city'] as String?)?.trim() ?? '',
    );
  }
}
