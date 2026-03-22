import 'package:flutter/material.dart';

void main() {
  runApp(const MyGhostApp());
}

class MyGhostApp extends StatelessWidget {
  const MyGhostApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MyGhost',
      home: Scaffold(
        appBar: AppBar(title: const Text('MyGhost v2.0')),
        body: const Center(child: Text('Flutter app scaffold is ready')),
      ),
    );
  }
}
