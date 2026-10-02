import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/network_group.dart';
import '../models/network_member.dart';

class NetworkMembersPage {
  const NetworkMembersPage({required this.items, required this.total});

  final List<NetworkMember> items;
  final int total;
}

class NetworkRepository {
  NetworkRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  static const perPage = 15;

  Future<List<NetworkGroup>> fetchMyGroups() async {
    final response = await _api.get<Map<String, dynamic>>('/groups/me');
    final data = response.data?['groups'];
    if (data is! List) {
      return const [];
    }
    return data
        .whereType<Map>()
        .map((item) => NetworkGroup.fromJson(item.cast<String, dynamic>()))
        .toList();
  }

  /// [query] filters by zip code when numeric, by first/last name otherwise —
  /// the web page exposes both as separate fields.
  Future<NetworkMembersPage> fetchMembers({
    required int groupId,
    required int page,
    String query = '',
  }) async {
    final trimmed = query.trim();
    final isZip = trimmed.isNotEmpty && int.tryParse(trimmed) != null;

    final response = await _api.get<Map<String, dynamic>>(
      '/groups/$groupId',
      queryParameters: {
        'page': page,
        'perPage': perPage,
        'sortKey': 'lastname',
        'sortOrder': 'ASC',
        if (trimmed.isNotEmpty && isZip) 'zip': trimmed,
        if (trimmed.isNotEmpty && !isZip) 'name': trimmed,
      },
    );

    final root = response.data ?? const {};
    final data = (root['users'] as Map?)?['data'];
    final items = data is List
        ? data
            .whereType<Map>()
            .map((item) => NetworkMember.fromJson(item.cast<String, dynamic>()))
            .toList()
        : <NetworkMember>[];

    final total = int.tryParse(root['count']?.toString() ?? '') ?? items.length;
    return NetworkMembersPage(items: items, total: total);
  }

  Future<void> createGroup(String name) {
    return _api.post<void>('/groups', data: {'name': name.trim()});
  }

  Future<void> assignByEmail({required int groupId, required String email}) {
    return _api.post<void>(
      '/groups/assign/$groupId',
      data: {'email': email.trim()},
    );
  }
}

final networkRepositoryProvider = Provider<NetworkRepository>((ref) {
  return NetworkRepository(apiClient: ref.watch(apiClientProvider));
});
