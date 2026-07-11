class ReplacementSearchParams {
  const ReplacementSearchParams({
    this.zipCodes = const [],
    this.cities = const [],
    this.days = const [],
    this.filterType = 'all',
    this.filterRole = 'all',
    this.country = 'be',
    this.page = 1,
    this.perPage = 25,
  });

  static const defaults = ReplacementSearchParams();

  final List<String> zipCodes;
  final List<String> cities;
  final List<String> days;
  final String filterType;
  final String filterRole;
  final String country;
  final int page;
  final int perPage;

  bool get hasActiveSearch => zipCodes.isNotEmpty || cities.isNotEmpty;

  bool get hasActiveFilters =>
      filterType != 'all' ||
      filterRole != 'all' ||
      days.isNotEmpty ||
      country != defaultCountry;

  static const defaultCountry = 'be';

  bool get hasAnyActive => hasActiveSearch || hasActiveFilters;

  ReplacementSearchParams copyWith({
    List<String>? zipCodes,
    List<String>? cities,
    List<String>? days,
    String? filterType,
    String? filterRole,
    String? country,
    int? page,
    int? perPage,
  }) {
    return ReplacementSearchParams(
      zipCodes: zipCodes ?? this.zipCodes,
      cities: cities ?? this.cities,
      days: days ?? this.days,
      filterType: filterType ?? this.filterType,
      filterRole: filterRole ?? this.filterRole,
      country: country ?? this.country,
      page: page ?? this.page,
      perPage: perPage ?? this.perPage,
    );
  }

  ReplacementSearchParams clearSearch() {
    return copyWith(zipCodes: const [], cities: const []);
  }

  ReplacementSearchParams clearFilters() {
    return copyWith(
      days: const [],
      filterType: 'all',
      filterRole: 'all',
      country: defaultCountry,
    );
  }

  Map<String, dynamic> toApiBody() {
    return {
      'days': days,
      'cities': cities,
      'zipCodes': zipCodes,
      'type': '',
      'country': country,
      'filters': {
        'type': filterType,
        'role': filterRole,
      },
      'provinces': <String>[],
      'page': page,
      'perPage': perPage,
      'groupByProvince': false,
    };
  }
}

const replacementCountryLabels = <String, String>{
  'be': 'Belgique',
  'fr': 'France',
};

const replacementCountryCodes = ['be', 'fr'];

const replacementTypeLabels = <String, String>{
  'all': 'Tous',
  'classic': 'Classique',
  'immediate': 'Urgent',
};

const replacementRoleLabels = <String, String>{
  'all': 'Tous',
  'nurse': 'Infirmier(ère)',
  'caregiver': 'Aide soignant(e)',
  'midwife': 'Sage-femme',
};

const replacementDayLabels = <String, String>{
  'monday': 'Lundi',
  'tuesday': 'Mardi',
  'wednesday': 'Mercredi',
  'thursday': 'Jeudi',
  'friday': 'Vendredi',
  'saturday': 'Samedi',
  'sunday': 'Dimanche',
};

const replacementWeekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
