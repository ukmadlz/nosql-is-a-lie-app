
# Encoding: utf-8

module Utils

  class SimpleLogger

    class << self

      def warning(msg)
        STDERR.puts "Warning: #{msg}"
      end

      def error(msg)
        STDERR.puts "Error: #{msg}"
      end

      def info(msg)
        STDOUT.puts "#{msg}"
      end

    end

  end

end

