const element = document.querySelector('.screenshots');
if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    console.log('Screenshots section found and scrolled to');
} else {
    console.log('Screenshots section not found');
}
