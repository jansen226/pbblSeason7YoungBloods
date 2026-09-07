import React, { useEffect } from 'react';
import BeybladeTracker from './BeybladeTracker';
import { seedInitialMatchesIfEmpty } from './firebase';

function App() {
  useEffect(() => {
    seedInitialMatchesIfEmpty();
  }, []);

  return (
    <div>
      <BeybladeTracker />
    </div>
  );
}

export default App;