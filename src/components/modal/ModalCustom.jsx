import Modal from 'react-modal';
import { useUiStore } from '../../hooks';
import 'animate.css';
import './Modal.css';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
    },
};

Modal.setAppElement('#root');

export const ModalCustom = ({children}) => {

    const { isDateModalOpen, closeDateModal } = useUiStore();

    const onCloseModal = ()=> {
      closeDateModal()
    }

  return (
    <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className={`ReactModal__Content modal animate__animated ${ isDateModalOpen ? 'animate__fadeIn' : 'animate__fadeOut'}`}
        overlayClassName='ReactModal__Overlay'
        
    >
        {children}
    </Modal>
  )
}