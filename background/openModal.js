
const channel = new BroadcastChannel('words');
console.log("channel started")
channel.addEventListener('message', event => {
        console.log("messages received");
        const modal = document.createElement('div');
        const main = document.getElementById('main');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';

        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';

        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.innerHTML = 
        main.appendChild(modal);

      });