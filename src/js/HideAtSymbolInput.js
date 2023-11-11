const inputElement = document.getElementById('hledat');

// Pokud text začíná @ bude text skrytý
inputElement.addEventListener('input', function() {
  const text = this.value;
  if (text.startsWith('@')) {
    this.type = 'password';
  } else {
    this.type = 'text';
  }
});