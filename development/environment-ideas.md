# Environment ideas

## Hooks and Filters
Kinda inspired by Wordpress and other similar systems.

There should be a special connector that allows for subroutines to add filters to the inputs and outputs of `Renderer.compile()` and `Doer.execute()` calls. Perhaps have a wrapper around output that lets continued execution of a method call to stop and just return an output generated by a Filter. This would allow for a caching system to work just on hooks without the need for a specialised core component type (CacheManager).

It should not just be for subroutines. Any registered module should be allowed to register hooks into any other module.

### Possible problems
Might there be dependency issues if one module is trying to register hooks on another module that hasn't been initialised yet?

Perhaps some dependency information can be added to registered modules.

## Module loading
It would make sense to reflect on all installed packages and look for ones that are one of our core compent types and just have them sitting as instances in our system ready for use. Configuration information can then be loaded into a Module through some kind of module manager which would be responsible for calling `Module.init()`, `Module.destroy()`, etc.

## Subroutine loading
Similar to having a Module Manager, a Subroutine Manager could allow for the checking and registering of new Subroutines on the system. This would involve registering a subroutine with a Connector so it knows of any new configurations and can execute the subroutine when necessary.

The checking that could be done here is to make sure all required modules are registered and could even run through test data stored against each subroutine and task produce appropriate outputs.

## Generators/Iterators
There is probably a need for an in-built thing that can operate like an Iterator or Generator, yeilding outputs for a given range, set of inputs, until some condition is met.

### Possible problems and questions?
How does this work though? Would it be a Doer or Connector?

This would make sense to have a specialised "Dynamic" Doer that can manage the set of inputs, provides some kind of a check subroutine on each output that gives `continue/break` control as well as maybe issuing Context Commands.

Could Doers yeild results? If so, could this be event driven or can I actually develop these as Generator functions?

## Streams
Connectors can obviously consume streams but it should also be possible for a Doer to create a stream that can then be passed via our Internal Call Doer to another subroutine. I think this Doer would look a lot like the Generator Doer hypothesised above.

### Possible problems and questions?
Really think there need to be a few different fundamental types of Doer:
 * Plain old Doer - Called once, output stored
 * Generator Doer - Has `setup` and `step` properties (both object compilable)
   * Step would have 3 properties, `contextCommands[]` and `nextInput`, `break`

Really need to think about how Connectors handle multiple "responses", perhaps this will just work given that they can consume streams.