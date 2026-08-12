class AuthSession {
  const AuthSession({
    required this.token,
    required this.user,
  });

  final String token;
  final Map<String, dynamic> user;

  AuthSession copyWithUser(Map<String, dynamic> user) {
    return AuthSession(token: token, user: user);
  }

  String? get displayName {
    final fullName = user['full_name'];
    if (fullName is String && fullName.isNotEmpty) {
      return fullName;
    }
    final email = user['email'];
    if (email is String && email.isNotEmpty) {
      return email;
    }
    return null;
  }

  List<String> get roles {
    final raw = user['roles'];
    if (raw is List) {
      return raw.whereType<String>().toList();
    }
    return const [];
  }

  String get firstName {
    final firstname = user['firstname']?.toString().trim();
    if (firstname != null && firstname.isNotEmpty) {
      return firstname;
    }
    final fullName = user['full_name']?.toString().trim();
    if (fullName != null && fullName.isNotEmpty) {
      return fullName.split(RegExp(r'\s+')).first;
    }
    return 'Utilisateur';
  }

  String? profileImageUrl(String apiBaseUrl) {
    final path = user['profil_url']?.toString().trim();
    if (path == null || path.isEmpty) {
      return null;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final base = apiBaseUrl.endsWith('/')
        ? apiBaseUrl.substring(0, apiBaseUrl.length - 1)
        : apiBaseUrl;
    return '$base/storage/$path';
  }
}

class LoginResult {
  const LoginResult.authenticated({
    required this.token,
  }) : requiresTwoFactor = false,
       twoFactorHash = null,
       message = null;

  const LoginResult.twoFactorRequired({
    required this.twoFactorHash,
    this.message,
  })  : requiresTwoFactor = true,
        token = null;

  final bool requiresTwoFactor;
  final String? token;
  final String? twoFactorHash;
  final String? message;
}

class TwoFactorResult {
  const TwoFactorResult({
    required this.token,
    required this.user,
  });

  final String token;
  final Map<String, dynamic> user;
}
