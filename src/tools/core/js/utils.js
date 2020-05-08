export const getFileExtension = (fileName) => {
  return fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
};

export const getFileName = (fileName) => {
  return fileName.substr(0, fileName.lastIndexOf('.'));
};

export class ErrorModal {
  constructor({ message, closeText = 'OK' }) {
    this.message = message;
    this.closeText = closeText;
    this.isShowed = false;
    this.hasDOM = false;
    this.id = Math.floor(Math.random() * 200) + 1;
    this.classesNames = {
      container: 'error-modal-container',
      body: 'error-modal-body',
      message: 'error-modal-message',
      button: 'error-button-message',
    };
    this.container = null;

    this.show();
  }

  generateDOM() {
    if (this.hasDOM) return;

    const errorContainer = document.createElement('div');
    errorContainer.classList.add(this.classesNames.container);
    errorContainer.id = this.id;

    const errorBody = document.createElement('div');
    errorBody.classList.add(this.classesNames.body);

    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = this.message;
    errorMessage.classList.add(this.classesNames.message);

    const errorButton = document.createElement('button');
    errorButton.innerHTML = this.closeText;

    errorButton.addEventListener('click', () => this.closeModal());

    errorBody.appendChild(errorMessage);
    errorBody.appendChild(errorButton);

    errorContainer.appendChild(errorBody);

    this.container = errorContainer;

    document.querySelector('body').appendChild(errorContainer);
  }

  show() {
    if (this.isShowed) return;

    this.isShowed = true;
    this.generateDOM();
  }

  closeModal() {
    if (!this.container) return;
    this.container.remove();
  }
}
