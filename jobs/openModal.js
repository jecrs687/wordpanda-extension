
const channel = new BroadcastChannel('words');
console.log("channel started")
channel.addEventListener('message', event => {
        console.log({event: event.data})
        localStorage.setItem('words', JSON.stringify(event.data));
        const modal = document.createElement('iframe');
        const main = document.getElementsByTagName('body')[0];
        modal.style.position = 'fixed';
        modal.style.top = '0px';
        modal.style.left = '0px';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.href = 'http://localhost:5173/';
        main.children = [modal, ...main.children];
      });