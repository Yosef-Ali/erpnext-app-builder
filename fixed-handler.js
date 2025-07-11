// Fixed handleGenerateFromPrompt function
const handleGenerateFromPrompt = async () => {
  if (!promptInput.trim()) {
    console.error('No prompt input provided');
    return;
  }

  console.log('Starting generation with input:', promptInput);
  setGenerating(true);
  setAnalyzing(true);
  setAnalysisProgress(0);
  
  try {
    let generatedPrdContent = '';
    let analysisResult = null;
    
    // Check if input is a simple prompt or full PRD
    const isSimplePrompt = promptInput.length < 200 && !promptInput.includes('#') && !promptInput.includes('##');
    console.log('Is simple prompt:', isSimplePrompt);
    
    if (isSimplePrompt) {
      // Generate PRD from simple prompt
      console.log('Generating PRD from prompt...');
      const response = await fetch(`${process.env.REACT_APP_MCP_URL || 'http://localhost:3000'}/hooks/generate-from-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptInput
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        generatedPrdContent = data.prd;
        analysisResult = data.analysis;
        setPrdContent(generatedPrdContent);
        setActiveTab('text');
        console.log('PRD generated successfully');
      } else {
        console.error('PRD generation failed:', data);
        throw new Error(data.error || 'PRD generation failed');
      }
    } else {
      // Use the input as full PRD content
      console.log('Using input as full PRD content');
      generatedPrdContent = promptInput;
      setPrdContent(generatedPrdContent);
      setActiveTab('text');
    }
    
    // Continue with full workflow - always analyze the PRD content
    console.log('Starting full workflow...');
    console.log('Analyzing PRD content:', generatedPrdContent.substring(0, 200) + '...');
    
    if (!analysisResult) {
      analysisResult = await ApiService.analyzePRD(generatedPrdContent);
    }
    
    console.log('Analysis result:', analysisResult);
    await runFullWorkflow(analysisResult);
    
  } catch (error) {
    console.error('Generation failed:', error);
    alert(`Error: ${error.message}. Please check the console for details.`);
  } finally {
    setGenerating(false);
    setAnalyzing(false);
    setAnalysisProgress(0);
  }
};
