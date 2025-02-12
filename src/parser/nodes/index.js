import { doc, format } from 'prettier'
import php from '@prettier/plugin-php/standalone'

const { builders: { group, softline, indent } } = doc

class EchoNode {
    constructor(content, code) {
        this.content = content
        this.code = code
    }

    toDoc() {
        return group([this.toString()])
    }

    toString() {
        let code = format(`<?php ${this.code}`, { parser: 'php', plugins: [php] }).replace('<?php ', '').trim()
        code = code.substring(0, code.length - 1)

        return `{{ ${code} }}`
    }
}

class DirectiveNode {
    constructor(content, directive, code, line) {
        this.content = content
        this.directive = directive
        this.code = code
        this.line = line
    }

    toDoc() {
        return group([this.toString()])
    }

    toString() {
        return `@${this.directive}${this.code ? `(${this.code})` : ''}`
    }
}

class LiteralNode {
    constructor(content) {
        this.content = content
    }

    toDoc() {
        return group(this.toString())
    }

    toString() {
        return this.content
    }
}

class DirectivePairNode {
    constructor(open, close, children, line) {
        this.open = open
        this.close = close
        this.children = children
    }

    toDoc() {
        return group([
            softline,
            this.open.toDoc(),
            this.children.map(child => indent(child.toDoc())),
            this.close.toDoc()
        ])
    }

    toString() {
        return `${this.open.toString()}${this.children.map(child => child.toString()).join()}${this.close.toString()}`
    }
}

export { EchoNode, DirectiveNode, LiteralNode, DirectivePairNode }