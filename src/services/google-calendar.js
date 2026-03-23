export async function listEvents() {
  return { success: true, events: [] };
}

export async function createEvent(event) {
  return { success: true, event };
}
