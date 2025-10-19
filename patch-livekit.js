// patch-livekit.js
const fs = require('fs');
const path = require('path');

function patchLiveKit() {
  console.log('🔧 Application du patch LiveKit...');
  
  const livekitIndexPath = path.join(__dirname, 'node_modules', 'livekit-client', 'dist', 'src', 'index.d.ts');
  const livekitTrackPath = path.join(__dirname, 'node_modules', 'livekit-client', 'dist', 'src', 'room', 'track', 'LocalTrack.d.ts');
  
  // Patch index.d.ts
  if (fs.existsSync(livekitIndexPath)) {
    let content = fs.readFileSync(livekitIndexPath, 'utf8');
    
    content = content.replace(
      /export type \* from '\.\/room\/data-stream\/incoming\/StreamReader';/g,
      '// export type * from \'./room/data-stream/incoming/StreamReader\';'
    );
    
    content = content.replace(
      /export type \* from '\.\/room\/data-stream\/outgoing\/StreamWriter';/g,
      '// export type * from \'./room/data-stream/outgoing/StreamWriter\';'
    );
    
    fs.writeFileSync(livekitIndexPath, content);
    console.log('✅ index.d.ts patché');
  }
  
  // Patch LocalTrack.d.ts
  if (fs.existsSync(livekitTrackPath)) {
    let content = fs.readFileSync(livekitTrackPath, 'utf8');
    
    content = content.replace(
      /replaceTrack\(track: MediaStreamTrack, options\?: ReplaceTrackOptions\): Promise<typeof this>;/g,
      'replaceTrack(track: MediaStreamTrack, options?: ReplaceTrackOptions): Promise<any>;'
    );
    
    fs.writeFileSync(livekitTrackPath, content);
    console.log('✅ LocalTrack.d.ts patché');
  }
  
  console.log('🎉 Patch LiveKit appliqué avec succès!');
}

patchLiveKit();