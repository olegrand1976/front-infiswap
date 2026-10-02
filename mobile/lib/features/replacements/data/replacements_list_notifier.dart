import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/async_value_refreshing.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../models/replacement_item.dart';
import '../models/replacement_search_params.dart';
import 'replacements_repository.dart';

final replacementsLoadingMoreProvider = StateProvider<bool>((ref) => false);

class ReplacementsListNotifier extends AsyncNotifier<List<ReplacementItem>> {
  ReplacementSearchParams _params = ReplacementSearchParams.defaults;
  bool _hasMore = true;
  Object? _userId;

  ReplacementSearchParams get params => _params;
  bool get hasMore => _hasMore;

  @override
  Future<List<ReplacementItem>> build() async {
    final userId = ref.watch(authSessionProvider.select((s) => s?.user['id']));
    if (userId != _userId) {
      _userId = userId;
      _params = ReplacementSearchParams.defaults;
    }
    if (userId == null) {
      _hasMore = false;
      return const [];
    }
    _params = _params.copyWith(page: 1);
    final page = await ref
        .watch(replacementsRepositoryProvider)
        .fetchSearchPage(_params);
    _hasMore = page.items.length < page.total;
    return page.items;
  }

  Future<void> applyParams(
    ReplacementSearchParams params, {
    bool keepPrevious = false,
  }) async {
    _params = params.copyWith(page: 1);
    _hasMore = true;
    state = keepPrevious ? state.refreshing : const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final page = await ref
          .read(replacementsRepositoryProvider)
          .fetchSearchPage(_params);
      _hasMore = page.items.length < page.total;
      return page.items;
    });
  }

  Future<void> loadMore() async {
    if (!_hasMore || ref.read(replacementsLoadingMoreProvider)) {
      return;
    }
    final current = state.valueOrNull;
    if (current == null) {
      return;
    }

    ref.read(replacementsLoadingMoreProvider.notifier).state = true;
    try {
      final nextParams = _params.copyWith(page: _params.page + 1);
      final page = await ref
          .read(replacementsRepositoryProvider)
          .fetchSearchPage(nextParams);
      _params = nextParams;
      final merged = [...current, ...page.items];
      _hasMore = merged.length < page.total;
      state = AsyncData(merged);
    } catch (_) {
      // Silent: the user can retry by scrolling again; the existing list stays intact.
    } finally {
      ref.read(replacementsLoadingMoreProvider.notifier).state = false;
    }
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

  Future<void> refresh() => applyParams(_params, keepPrevious: true);
}

final replacementsListProvider =
    AsyncNotifierProvider<ReplacementsListNotifier, List<ReplacementItem>>(
  ReplacementsListNotifier.new,
);
