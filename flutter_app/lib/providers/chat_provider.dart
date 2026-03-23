import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/chat_message.dart';
import '../services/api_service.dart';

class ChatProvider extends ChangeNotifier {
  ChatProvider({required ApiService apiService}) : _apiService = apiService;

  static const String _apiUrlKey = 'api_url';
  static const String _modelKey = 'selected_model';

  final ApiService _apiService;

  final List<ChatMessage> _messages = <ChatMessage>[];
  List<ChatMessage> get messages => List<ChatMessage>.unmodifiable(_messages);

  bool _loading = false;
  bool get loading => _loading;

  String _apiUrl = 'http://10.0.2.2:3000';
  String get apiUrl => _apiUrl;

  String _selectedModel = 'ace3';
  String get selectedModel => _selectedModel;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _apiUrl = prefs.getString(_apiUrlKey) ?? _apiUrl;
    _selectedModel = prefs.getString(_modelKey) ?? _selectedModel;
    notifyListeners();
  }

  Future<void> updateApiUrl(String value) async {
    _apiUrl = value.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_apiUrlKey, _apiUrl);
    notifyListeners();
  }

  Future<void> switchModel(String modelId) async {
    _loading = true;
    notifyListeners();

    try {
      await ApiService(baseUrl: _apiUrl).switchModel(modelId);
      _selectedModel = modelId;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_modelKey, modelId);
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> sendMessage(String userText) async {
    if (userText.trim().isEmpty || _loading) {
      return;
    }

    _messages.add(ChatMessage(role: 'user', content: userText));
    _loading = true;
    notifyListeners();

    try {
      final reply = await ApiService(baseUrl: _apiUrl).sendMessage(
        userId: 'mobile-user',
        message: userText,
      );
      _messages.add(ChatMessage(role: 'assistant', content: reply));
    } catch (error) {
      _messages.add(ChatMessage(role: 'assistant', content: '❌ $error'));
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  void clear() {
    _messages.clear();
    notifyListeners();
  }
}
