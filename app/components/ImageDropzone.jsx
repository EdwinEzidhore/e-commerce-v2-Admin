"use client"
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageDropzone = ({ multiple=true, onImageUpload }) => {
    const [imageURL, setImageURL] = useState([]);
    const [fileObjects, setfileObjects] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                const binaryStr = reader.result;
                
                setImageURL((prevURL) => multiple ? [...prevURL, binaryStr] : [binaryStr])  
            
                multiple ? setfileObjects((obj)=> [...obj,file]) :             setfileObjects(file);
            };
            reader.readAsDataURL(file);
        });
    }, [multiple]);

    useEffect(() => {
        if (onImageUpload) {
            onImageUpload(fileObjects);
        }
    }, [imageURL]);

    const { getRootProps, getInputProps,  } = useDropzone({
        onDrop,
        multiple,
        
    });

    return (

        <div {...getRootProps()} className='border border-dashed py-10 px-6 text-[gray] mx-auto'>
            <input {...getInputProps()} />
            {
                imageURL.length > 0 ? (
                    <div className='flex gap-2 flex-wrap'>
                        {
                            imageURL.map((url, index) => (
                                <div key={index}>
                                    <Image width={100} height={80} src={url} alt="prev-image" />
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className='text-center flex items-center flex-col gap-4'>
                        <UploadCloud />
                        <p>Drag & drop files here, or click to select files</p>
                    </div>
                )
            }
        </div>
    );
}

export default ImageDropzone;