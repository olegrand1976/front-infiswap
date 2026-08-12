class NotificationPreferences {
  const NotificationPreferences({
    required this.newReplacement,
    required this.replacementAccepted,
    required this.digestWeekly,
    required this.urgentOnly,
    required this.smsUrgent,
  });

  factory NotificationPreferences.fromJson(Map<String, dynamic>? json) {
    bool readBool(String key, bool fallback) {
      final value = json?[key];
      if (value is bool) return value;
      return fallback;
    }

    return NotificationPreferences(
      newReplacement: readBool('new_replacement', true),
      replacementAccepted: readBool('replacement_accepted', true),
      digestWeekly: readBool('digest_weekly', true),
      urgentOnly: readBool('urgent_only', false),
      smsUrgent: readBool('sms_urgent', false),
    );
  }

  final bool newReplacement;
  final bool replacementAccepted;
  final bool digestWeekly;
  final bool urgentOnly;
  final bool smsUrgent;

  NotificationPreferences copyWith({
    bool? newReplacement,
    bool? replacementAccepted,
    bool? digestWeekly,
    bool? urgentOnly,
    bool? smsUrgent,
  }) {
    return NotificationPreferences(
      newReplacement: newReplacement ?? this.newReplacement,
      replacementAccepted: replacementAccepted ?? this.replacementAccepted,
      digestWeekly: digestWeekly ?? this.digestWeekly,
      urgentOnly: urgentOnly ?? this.urgentOnly,
      smsUrgent: smsUrgent ?? this.smsUrgent,
    );
  }

  Map<String, dynamic> toJson() => {
        'new_replacement': newReplacement,
        'replacement_accepted': replacementAccepted,
        'digest_weekly': digestWeekly,
        'urgent_only': urgentOnly,
        'sms_urgent': smsUrgent,
      };
}

class ReplacementZonePreferences {
  const ReplacementZonePreferences({
    required this.cities,
    required this.zipCodes,
  });

  factory ReplacementZonePreferences.fromJson(Map<String, dynamic>? json) {
    List<String> readList(String key) {
      final value = json?[key];
      if (value is List) {
        return value.whereType<String>().where((e) => e.isNotEmpty).toList();
      }
      return const [];
    }

    return ReplacementZonePreferences(
      cities: readList('cities'),
      zipCodes: readList('zip_codes'),
    );
  }

  final List<String> cities;
  final List<String> zipCodes;
}

class PersonalInfoData {
  PersonalInfoData({
    required this.institutionName,
    required this.lastname,
    required this.firstname,
    required this.dateOfBirth,
    required this.email,
    required this.identifierNumber,
    required this.phoneNumber,
    required this.gender,
    required this.professionalCategory,
  });

  factory PersonalInfoData.fromUser(Map<String, dynamic> user) {
    final institution = user['institution'];
    return PersonalInfoData(
      institutionName: institution is Map ? institution['name']?.toString() : null,
      lastname: user['lastname']?.toString() ?? '',
      firstname: user['firstname']?.toString() ?? '',
      dateOfBirth: _parseDate(user['date_of_birth']),
      email: user['email']?.toString() ?? '',
      identifierNumber: user['identifier_number']?.toString(),
      phoneNumber: user['phone_number']?.toString(),
      gender: user['gender']?.toString(),
      professionalCategory: user['professional_category']?.toString(),
    );
  }

  static DateTime? _parseDate(dynamic value) {
    if (value is! String || value.isEmpty) return null;
    return DateTime.tryParse(value);
  }

  String? institutionName;
  String lastname;
  String firstname;
  DateTime? dateOfBirth;
  String email;
  String? identifierNumber;
  String? phoneNumber;
  String? gender;
  String? professionalCategory;
}

class AddressData {
  AddressData({
    required this.streetAddress,
    required this.city,
    required this.country,
    required this.zipCode,
    required this.additionalInfo,
    required this.workingAt,
  });

  factory AddressData.fromUser(Map<String, dynamic> user) {
    return AddressData(
      streetAddress: user['street_address']?.toString() ?? '',
      city: user['city']?.toString() ?? '',
      country: user['country']?.toString() ?? 'be',
      zipCode: user['zip_code']?.toString() ?? '',
      additionalInfo: user['additional_info']?.toString(),
      workingAt: user['working_at']?.toString(),
    );
  }

  String streetAddress;
  String city;
  String country;
  String zipCode;
  String? additionalInfo;
  String? workingAt;
}
