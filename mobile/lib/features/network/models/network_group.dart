/// A group the current nurse belongs to (`GET /groups/me`).
class NetworkGroup {
  const NetworkGroup({
    required this.id,
    required this.name,
    required this.isAdmin,
  });

  final int id;
  final String name;

  /// Group admins can add members — mirrors `isAdminGroup` on the web.
  final bool isAdmin;

  factory NetworkGroup.fromJson(Map<String, dynamic> json) {
    return NetworkGroup(
      id: int.tryParse(json['id']?.toString() ?? '') ?? 0,
      name: (json['name'] as String?)?.trim() ?? '',
      isAdmin: json['role_name'] == 'administrator',
    );
  }
}
