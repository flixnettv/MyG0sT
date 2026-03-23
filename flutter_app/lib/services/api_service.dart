import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiService {
  ApiService({required this.baseUrl});

  final String baseUrl;

  Future<Map<String, dynamic>> healthCheck() async {
    final response = await http.get(Uri.parse('$baseUrl/health'));
    if (response.statusCode >= 400) {
      throw Exception('Health check failed: ${response.body}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<String> sendMessage({required String userId, required String message}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/chat'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'message': message}),
    );

    if (response.statusCode >= 400) {
      throw Exception('Failed to send message: ${response.body}');
    }

    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return payload['content']?.toString() ?? '';
  }

  Future<List<dynamic>> getModels() async {
    final response = await http.get(Uri.parse('$baseUrl/api/models'));
    if (response.statusCode >= 400) {
      throw Exception('Failed to load models: ${response.body}');
    }
    final payload = jsonDecode(response.body) as Map<String, dynamic>;
    return payload['models'] as List<dynamic>? ?? <dynamic>[];
  }

  Future<void> switchModel(String modelId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/models/switch'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'modelId': modelId}),
    );

    if (response.statusCode >= 400) {
      throw Exception('Failed to switch model: ${response.body}');
    }
  }
}
