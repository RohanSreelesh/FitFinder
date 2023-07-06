import React, {useState} from 'react';
import { useDropzone } from 'react-dropzone';
import {supabase} from '../../../../lib/supabaseClient'
import { useAuth } from '../providers/supabase-auth-provider';
import ShowImages from './ShowImages';
import {v4 as uuidv4} from 'uuid';
const UserDropzone = (props: any) => {
  const { user } = useAuth();
  const [uploadCount, setUploadCount] = useState(0); 
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 5) {
        alert("You can only upload up to 5 files at a time.");
        return;
      }

      const userFolderPath = `${user.email}/`;  // Path where user's files are stored
      const { data: oldFiles, error: listError } = await supabase.storage.from('avatars').list(userFolderPath);

      if (listError) {
        console.error('Error listing files: ', listError.message);
        return;
      }
      
      if ((oldFiles.length + acceptedFiles.length) > 5) {
        alert('You have reached the maximum number of uploads (5).');
        return;
      }
      for(const file of acceptedFiles){
        const filePath = `${user.id}/${uuidv4()}`; // File path in Supabase storage
        try {
          const { data, error } = await supabase.storage.from('avatars').upload(filePath, file);

          if (error) {
            console.error('Error uploading file: ', error.message);
            continue;
          }

          // Upload Confirmation
          const { data: newFiles, error: confirmError } = await supabase.storage.from('avatars').list(userFolderPath);

          if (confirmError) {
            console.error('Error confirming upload: ', confirmError.message);
            continue;
          }

          const newFile = newFiles.find(f => f.name === file.name);

          if (!newFile) {
            console.error(`Uploaded file ${file.name} not found.`);
          } else {
            console.log("File uploaded successfully!");
          }
        } catch (error) {
          console.error('Unexpected error uploading file: ', error);
        }
      }
      setUploadCount(uploadCount => uploadCount + 1);
    },
  });
  
  return (
    <div {...getRootProps()} className={props.className}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
      {props.children}
      <ShowImages />
    </div>
  )
}

export default UserDropzone;
