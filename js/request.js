export async function sendRequest(method, URL, body, headers) {
  const request = await fetch(URL, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  });
  
  const response = await request.json();
  return response;
}

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};