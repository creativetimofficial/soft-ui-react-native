import EventEmitter from '@services/AppEventEmitter';

const closeModalLayout = () => EventEmitter.emit('modal.layout.close');
const openModalTag = () => EventEmitter.emit('modal.tag.open');
const openModalCategory = () => EventEmitter.emit('modal.category.open');
const closeModalTag = () => EventEmitter.emit('modal.tag.close');

const onOpenModalTag = (func) =>
  EventEmitter.addListener('modal.tag.open', func);
const onOpenModalCategory = (func) =>
  EventEmitter.addListener('modal.category.open', func);
const onOpenUserModal = (func) =>
  EventEmitter.addListener('modal.user.open', func);
const onCloseUserModal = (func) =>
  EventEmitter.addListener('modal.user.close', func);

const openModalSorting = () => EventEmitter.emit('modal.sorting.open');
const onOpenModalSorting = (func) =>
  EventEmitter.addListener('modal.sorting.open', func);
const openModalLayout = () => EventEmitter.emit('modal.layout.open');
const onOpenModalLayout = (func) =>
  EventEmitter.addListener('modal.layout.open', func);

export default {
  closeModalTag,
  openModalTag,
  openModalLayout,
  closeModalLayout,
  openModalCategory,
  onOpenModalLayout,
  onOpenModalTag,
  onOpenUserModal,
  onCloseUserModal,
  onOpenModalCategory,

  openModalSorting,
  onOpenModalSorting,
};
