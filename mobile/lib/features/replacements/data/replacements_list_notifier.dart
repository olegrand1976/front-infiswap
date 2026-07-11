import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/replacement_item.dart';
import '../models/replacement_search_params.dart';
import 'replacements_repository.dart';

class ReplacementsListNotifier extends AsyncNotifier<List<ReplacementItem>> {
  ReplacementSearchParams _params = ReplacementSearchParams.defaults;

  ReplacementSearchParams get params => _params;

  @override
  Future<List<ReplacementItem>> build() async {
    final repository = ref.watch(replacementsRepositoryProvider);
    return repository.fetchMergedList(_params);
  }

  Future<void> applyParams(ReplacementSearchParams params) async {
    _params = params;
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => ref.read(replacementsRepositoryProvider).fetchMergedList(_params),
    );
  }

  Future<void> applySearch({
    required List<String> zipCodes,
    required List<String> cities,
  }) {
    return applyParams(
      _params.copyWith(zipCodes: zipCodes, cities: cities, page: 1),
    );
  }

  Future<void> applyFilters({
    required String country,
    required String filterType,
    required String filterRole,
    required List<String> days,
  }) {
    return applyParams(
      _params.copyWith(
        country: country,
        filterType: filterType,
        filterRole: filterRole,
        days: days,
        page: 1,
      ),
    );
  }

  Future<void> clearAll() => applyParams(ReplacementSearchParams.defaults);

  Future<void> removeZipCode(String zip) {
    return applyParams(
      _params.copyWith(
        zipCodes: _params.zipCodes.where((z) => z != zip).toList(),
        page: 1,
      ),
    );
  }

  Future<void> removeCity(String city) {
    return applyParams(
      _params.copyWith(
        cities: _params.cities.where((c) => c != city).toList(),
        page: 1,
      ),
    );
  }

  Future<void> removeDay(String day) {
    return applyParams(
      _params.copyWith(
        days: _params.days.where((d) => d != day).toList(),
        page: 1,
      ),
    );
  }

  Future<void> clearFilterType() {
    return applyParams(_params.copyWith(filterType: 'all', page: 1));
  }

  Future<void> clearFilterRole() {
    return applyParams(_params.copyWith(filterRole: 'all', page: 1));
  }

  Future<void> clearCountry() {
    return applyParams(
      _params.copyWith(
        country: ReplacementSearchParams.defaultCountry,
        page: 1,
      ),
    );
  }

  Future<void> refresh() => applyParams(_params);
}

final replacementsListProvider =
    AsyncNotifierProvider<ReplacementsListNotifier, List<ReplacementItem>>(
  ReplacementsListNotifier.new,
);
