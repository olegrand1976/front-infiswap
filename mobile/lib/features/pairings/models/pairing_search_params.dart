enum PairingTab { search, mine }

class PairingSearchParams {
  const PairingSearchParams({
    this.zipCodes = const [],
    this.cities = const [],
    this.tab = PairingTab.search,
    this.page = 1,
    this.perPage = 15,
  });

  static const defaults = PairingSearchParams();

  final List<String> zipCodes;
  final List<String> cities;
  final PairingTab tab;
  final int page;
  final int perPage;

  bool get hasActiveSearch => zipCodes.isNotEmpty || cities.isNotEmpty;

  PairingSearchParams copyWith({
    List<String>? zipCodes,
    List<String>? cities,
    PairingTab? tab,
    int? page,
    int? perPage,
  }) {
    return PairingSearchParams(
      zipCodes: zipCodes ?? this.zipCodes,
      cities: cities ?? this.cities,
      tab: tab ?? this.tab,
      page: page ?? this.page,
      perPage: perPage ?? this.perPage,
    );
  }

  // `type` doesn't filter the in_search/available field on the API side —
  // it only picks the audience: mine, or everyone else's open requests.
  // Both types can come back mixed in the same page either way.
  Map<String, dynamic> toQuery() {
    return {
      'zip_code': zipCodes,
      'city': cities,
      'type': tab == PairingTab.mine ? 'my_requests' : 'in_search',
      'page': page,
      'perPage': perPage,
    };
  }
}
