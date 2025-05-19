import * as acorn from 'acorn'

export const useCodeParser = (codeString) => {
  const detectLanguage = (code) => {
    // Simple language detection based on syntax patterns
    if (code.includes('function') || code.includes('var') || code.includes('const')) {
      return 'javascript'
    } else if (code.includes('def ') || code.includes('import ') && code.includes(':')) {
      return 'python'
    } else if (code.includes('class ') && code.includes('{')) {
      return 'java'
    }
    return 'javascript' // Default
  }

  const parseCode = async (code) => {
    const language = detectLanguage(code)
    
    try {
      if (language === 'javascript') {
        // Parse JavaScript code using acorn
        const ast = acorn.parse(code, { 
          ecmaVersion: 2020,
          sourceType: 'module',
          locations: true,
          allowReturnOutsideFunction: true,
          allowAwaitOutsideFunction: true
        })
        
        return analyzeJavaScriptAST(ast, code)
      } else {
        // For non-JS languages, use a simplified analysis
        return analyzeGenericCode(code, language)
      }
    } catch (error) {
      console.error('Error parsing code:', error)
      // Try pattern-based analysis as fallback
      return analyzeByPatterns(code, language)
    }
  }
  
  const analyzeJavaScriptAST = (ast, originalCode) => {
    const functions = []
    const loops = []
    const conditionals = []
    const variables = []
    const lines = originalCode.split('\n')
    
    // Recursive walker for the AST
    const walk = (node, parent = null) => {
      if (!node) return
      
      switch (node.type) {
        case 'FunctionDeclaration':
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
          const startLine = node.loc ? node.loc.start.line - 1 : 0
          const endLine = node.loc ? node.loc.end.line - 1 : lines.length - 1
          const funcLines = lines.slice(startLine, endLine + 1)
          
          // Extract function name
          let funcName = 'anonymous'
          if (node.id && node.id.name) {
            funcName = node.id.name
          } else if (parent && parent.type === 'VariableDeclarator' && parent.id && parent.id.name) {
            funcName = parent.id.name
          } else if (parent && parent.type === 'AssignmentExpression' && parent.left && parent.left.name) {
            funcName = parent.left.name
          }
          
          functions.push({
            name: funcName,
            lines: funcLines,
            lineStart: startLine,
            lineEnd: endLine,
            complexity: funcLines.length
          })
          break
          
        case 'ForStatement':
        case 'WhileStatement':
        case 'DoWhileStatement':
        case 'ForInStatement':
        case 'ForOfStatement':
          loops.push({
            type: node.type,
            depth: 1,
            iterations: 4,
            line: node.loc ? node.loc.start.line : 0
          })
          break
          
        case 'IfStatement':
        case 'ConditionalExpression':
          conditionals.push({
            type: node.type,
            line: node.loc ? node.loc.start.line : 0,
            hasElse: node.alternate ? true : false
          })
          break
          
        case 'VariableDeclaration':
          node.declarations.forEach(decl => {
            if (decl.id && decl.id.name) {
              variables.push({
                name: decl.id.name,
                kind: node.kind,
                line: node.loc ? node.loc.start.line : 0
              })
            }
          })
          break
          
        case 'CallExpression':
          // Track method calls for complexity
          if (node.callee && node.callee.type === 'MemberExpression' && 
              node.callee.property && node.callee.property.name) {
            const methodName = node.callee.property.name
            if (['forEach', 'map', 'filter', 'reduce'].includes(methodName)) {
              loops.push({
                type: 'arrayMethod',
                method: methodName,
                depth: 1,
                iterations: 5,
                line: node.loc ? node.loc.start.line : 0
              })
            }
          }
          break
      }
      
      // Traverse child nodes
      for (const key in node) {
        const value = node[key]
        if (Array.isArray(value)) {
          value.forEach(child => {
            if (child && typeof child === 'object' && child.type) {
              walk(child, node)
            }
          })
        } else if (value && typeof value === 'object' && value.type) {
          walk(value, node)
        }
      }
    }
    
    walk(ast)
    
    // Calculate complexity based on structure
    const complexity = Math.min(1, 
      (functions.length * 0.1) + 
      (loops.length * 0.15) + 
      (conditionals.length * 0.1) + 
      (variables.length * 0.05)
    )
    
    return {
      complexity,
      functions,
      loops,
      conditionals,
      variables,
      lineCount: lines.length,
      language: 'javascript'
    }
  }
  
  const analyzeByPatterns = (code, language) => {
    const lines = code.split('\n')
    const functions = []
    const loops = []
    const conditionals = []
    const variables = []
    
    // Pattern-based analysis for JavaScript
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Functions (including function expressions)
      if (trimmedLine.includes('function') && trimmedLine.includes('(')) {
        const funcMatch = trimmedLine.match(/function\s*(\w*)\s*\(/) || 
                         trimmedLine.match(/(\w+)\s*[:=]\s*function/) ||
                         trimmedLine.match(/(\w+)\s*=.*function/)
        functions.push({
          name: funcMatch ? funcMatch[1] || 'anonymous' : 'function',
          lines: [line],
          lineStart: index,
          lineEnd: index,
          complexity: 1
        })
      }
      
      // Array methods (forEach, map, etc.)
      if (trimmedLine.includes('.forEach') || trimmedLine.includes('.map') || 
          trimmedLine.includes('.filter') || trimmedLine.includes('.reduce')) {
        loops.push({
          type: 'arrayMethod',
          depth: 1,
          iterations: 3,
          line: index + 1
        })
      }
      
      // For loops
      if (trimmedLine.startsWith('for ') || trimmedLine.includes(' for ')) {
        loops.push({
          type: 'for',
          depth: 1,
          iterations: 4,
          line: index + 1
        })
      }
      
      // If statements
      if (trimmedLine.startsWith('if ') || trimmedLine.includes(' if ')) {
        conditionals.push({
          type: 'if',
          line: index + 1,
          hasElse: false
        })
      }
      
      // Variables
      if (trimmedLine.startsWith('var ') || trimmedLine.startsWith('let ') || 
          trimmedLine.startsWith('const ')) {
        const varMatch = trimmedLine.match(/(var|let|const)\s+(\w+)/)
        if (varMatch) {
          variables.push({
            name: varMatch[2],
            kind: varMatch[1],
            line: index + 1
          })
        }
      }
    })
    
    const complexity = Math.min(1, 
      (functions.length * 0.1) + 
      (loops.length * 0.15) + 
      (conditionals.length * 0.1) + 
      (variables.length * 0.02) +
      (lines.length * 0.005)
    )
    
    return {
      complexity,
      functions,
      loops,
      conditionals,
      variables,
      lineCount: lines.length,
      language
    }
  }
  
  const analyzeGenericCode = (code, language) => {
    const lines = code.split('\n')
    const functions = []
    const loops = []
    const conditionals = []
    const variables = []
    
    // Simple pattern matching for non-JS languages
    lines.forEach((line, index) => {
      // Python
      if (language === 'python') {
        if (line.trim().startsWith('def ')) {
          const match = line.match(/def\s+(\w+)/)
          functions.push({
            name: match ? match[1] : 'function',
            lines: [line],
            lineStart: index,
            lineEnd: index
          })
        }
        if (line.includes('for ') || line.includes('while ')) {
          loops.push({
            type: 'loop',
            depth: 1,
            iterations: 4,
            line: index + 1
          })
        }
        if (line.includes('if ') || line.includes('elif ')) {
          conditionals.push({
            type: 'conditional',
            line: index + 1
          })
        }
      }
    })
    
    const complexity = Math.min(1, 
      (functions.length * 0.1) + 
      (loops.length * 0.15) + 
      (conditionals.length * 0.1) +
      (lines.length * 0.005)
    )
    
    return {
      complexity,
      functions,
      loops,
      conditionals,
      variables,
      lineCount: lines.length,
      language
    }
  }
  
  return parseCode(codeString)
}