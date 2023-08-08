import React, { useState, useEffect } from 'react';
import { categories } from "../../../../../../public/index"

export default function ChipsArray(props) {
  const [allTags, setAllTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showSuggestedTags, setShowSuggestedTags] = useState(true);

  useEffect(() => {
    setAllTags(categories.map((item, index) => ({
      label: item,
      key: index,
      selected: false,
    })));
  }, [])

  useEffect(() => {
    const fetchSuggestedTags = async () => {
      const suggestionsResponse = await fetch("/api/tags");
      if (suggestionsResponse.status === 200) {
        const suggestedData = await suggestionsResponse.json();
        setSuggestedTags(suggestedData);
      }
    }

    fetchSuggestedTags();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch(`/api/tags/${props.user_id}`);
      if (response.status === 200) {
        const data = await response.json();
        setAllTags(allTags => allTags.map(tag => ({
          ...tag,
          selected: data.some(item => item.tag === tag.label)
        })));

        if (data.length === 0) {
          setShowSuggestedTags(true);
        } else {
          setShowSuggestedTags(false);
        }
      }
    }

    fetchTags();
  }, []);

  useEffect(() => {
    const selectedTags = allTags.filter(tag => tag.selected);
    setShowSuggestedTags(selectedTags.length === 0);
  }, [allTags]);

  const handleSelectTag = async (tag) => {
    if(allTags.filter(chip => chip.selected).length >= 3) return;
    const tagExists = allTags.some(chip => chip.label.toString().toLowerCase() === tag.label.toLowerCase() && chip.selected);
    if (!tagExists) {
      const response = await fetch(`/api/tags/${props.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tag: tag.label
        })
      });

      if (response.status === 200) {
        setAllTags(allTags.map(t => t.key === tag.key ? { ...t, selected: true } : t));
      } else {
        console.log('Could not add tag.');
      }
    }
  }

  const handleDeselectTag = async (tag) => {
    const response = await fetch(`/api/tags/${props.user_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tag: tag.label
      })
    });

    if (response.status === 200) {
      setAllTags(allTags.map(t => t.key === tag.key ? { ...t, selected: false } : t));
    } else {
      console.log('Could not delete tag.');
    }
  }
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="flex items-center mb-4 text-white">
        <div className="flex flex-wrap">
          {allTags && allTags.map((tag) => {
            const isSuggested = showSuggestedTags && suggestedTags.includes(tag.label);
            return (
              <div 
                key={tag.key} 
                className={`m-1 p-1 border rounded cursor-pointer ${tag.selected ? 'border-blue-500' : (isSuggested && !tag.selected ? 'border-green-500' : 'border-gray-300')}`} 
                onClick={() => tag.selected ? handleDeselectTag(tag) : handleSelectTag(tag)}
              >
                {tag.label}
              </div>
            )
          })}
          
        </div>
      </div>
    </div>
  );
}
