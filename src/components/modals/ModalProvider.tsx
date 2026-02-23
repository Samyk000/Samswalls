/**
 * Modal Provider
 * 
 * Manages all modals in the app. Listens to modalStore changes
 * and renders the appropriate modal.
 */

'use client';

import { useEffect } from 'react';
import { useModalStore } from '@/stores/modalStore';
import { BrowseModal } from './BrowseModal';
import { CategoriesModal } from './CategoriesModal';
import { WallpaperModal } from './WallpaperModal';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';

export function ModalProvider() {
  const { currentModal, modalData, closeModal, goBack } = useModalStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useModalStore.getState().openModal('search');
      }
      // Cmd/Ctrl + B for browse
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        useModalStore.getState().openModal('browse');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <BrowseModal
        isOpen={currentModal === 'browse'}
        onClose={closeModal}
        initialCategory={modalData.categorySlug as string | undefined}
      />

      <CategoriesModal
        isOpen={currentModal === 'categories'}
        onClose={closeModal}
      />

      <WallpaperModal
        isOpen={currentModal === 'wallpaper'}
        onClose={closeModal}
        wallpaperId={modalData.wallpaperId as string | undefined}
        onBack={goBack}
      />

      <SearchModal
        isOpen={currentModal === 'search'}
        onClose={closeModal}
      />

      <AuthModal
        isOpen={currentModal === 'auth'}
        onClose={closeModal}
        initialMode={modalData.authMode as 'login' | 'register' | undefined}
      />
    </>
  );
}
