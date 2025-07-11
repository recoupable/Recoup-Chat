"use client";

import React, { useState } from 'react';
import { MetadataPopupWithChat, MetadataItem } from '@/components/MetadataPopup';

// Example usage of the new MetadataPopupWithChat component
// This replaces static metadata displays with interactive chat functionality

export function MetadataPopupUsageExample() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Example metadata for "El Niño Maravilla Pt. 1" as shown in the screenshots
  const exampleMetadata: MetadataItem = {
    id: 'el-nino-maravilla-pt1',
    title: 'El Niño Maravilla Pt. 1',
    artist: 'xcelencia',
    album: 'el niño maravilla',
    designer: 'muchozorro',
    devs: ['sweetman', 'zlad'],
    producers: ['producer1', 'producer2'], // Optional field
    description: 'El Niño Maravilla is the debut album by xcelencia, showcasing a unique blend of Latin urban and pop sounds. This project brings together a talented team of designers, developers, and producers to create a groundbreaking musical experience.'
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="p-8 bg-purple-900 min-h-screen flex items-center justify-center">
      {/* Example trigger - this would be your 3D planet/object in the actual implementation */}
      <div className="relative">
        <button
          onClick={handleOpenPopup}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          🪐 Click to view "El Niño Maravilla Pt. 1" Metadata
        </button>

        {/* Instructions */}
        <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-lg p-6 max-w-lg">
          <h3 className="text-white font-bold mb-3">Integration Instructions:</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• Replace your existing static metadata popup with this component</li>
            <li>• The popup now includes both Info and Chat tabs</li>
            <li>• Users can switch between viewing metadata and chatting about the content</li>
            <li>• Chat is contextual - it knows about the specific artist/project</li>
            <li>• Each metadata item gets its own chat session</li>
          </ul>
        </div>
      </div>

      {/* The new MetadataPopupWithChat component */}
      <MetadataPopupWithChat
        metadata={exampleMetadata}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
}

// Integration guide for your 3D interface:
/*

1. REPLACE EXISTING STATIC POPUP:
   Instead of showing static metadata, use this component:

   // Before (static):
   <StaticMetadataPopup 
     title="El Niño Maravilla Pt. 1" 
     artist="xcelencia" 
     ... 
   />

   // After (with chat):
   <MetadataPopupWithChat
     metadata={metadataItem}
     isOpen={isPopupOpen}
     onClose={() => setIsPopupOpen(false)}
   />

2. UPDATE YOUR 3D PLANET/OBJECT CLICK HANDLERS:
   When a user clicks on a planet/object in your 3D scene:

   const handlePlanetClick = (planetData) => {
     const metadata = {
       id: planetData.id,
       title: planetData.title,
       artist: planetData.artist,
       album: planetData.album,
       designer: planetData.designer,
       devs: planetData.devs,
       description: planetData.description,
       producers: planetData.producers // optional
     };
     
     setCurrentMetadata(metadata);
     setIsPopupOpen(true);
   };

3. BENEFITS:
   - Users can now chat about the content instead of just viewing static info
   - Each planet/project gets its own dedicated chat context
   - Maintains the beautiful visual design while adding interactivity
   - Users can ask questions like "Who else worked on this?" or "What genre is this?"

*/

export default MetadataPopupUsageExample;